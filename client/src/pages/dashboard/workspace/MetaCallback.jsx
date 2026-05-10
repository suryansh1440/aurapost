import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkspaceStore } from '../../../store/workspaceStore';

const MetaCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { connectMetaAccount } = useWorkspaceStore();
  
  const [status, setStatus] = useState('Processing connection...');
  const [error, setError] = useState('');
  const [wsId, setWsId] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const stateParam = searchParams.get('state');
      const stateError = searchParams.get('error');

      let parsedWsId = null;
      if (stateParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(stateParam));
          parsedWsId = parsed.workspaceId;
          setWsId(parsedWsId);
        } catch (e) {
          console.error("Failed to parse state", e);
        }
      }

      if (stateError) {
        setError(`Connection rejected or failed: ${searchParams.get('error_description') || stateError}`);
        return;
      }

      if (!code) {
        setError('No authorization code provided.');
        return;
      }

      if (!parsedWsId) {
        setError('Missing workspace context in callback state.');
        return;
      }

      try {
        setStatus('Exchanging tokens securely...');
        const res = await connectMetaAccount(parsedWsId, code);
        
        if (res && res.success) {
          setStatus('Accounts fetched! Redirecting...');
          // Store the pages data so the connect modal can read it after redirect
          sessionStorage.setItem(
            `meta_pending_${parsedWsId}`,
            JSON.stringify({ integrationId: res.integrationId, pages: res.pages })
          );
          setTimeout(() => {
            navigate(`/dashboard/workspaces/${parsedWsId}`, { replace: true });
          }, 1000);
        } else {
          setError('Failed to connect Meta account. Please try again.');
        }
      } catch (err) {
        setError('An unexpected error occurred during connection.');
      }
    };

    handleCallback();
  }, [searchParams, connectMetaAccount, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] fade-in">
      <div className="card w-full max-w-md p-8 flex flex-col items-center text-center">
        {error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#ff7675]/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff7675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-white mb-2">Connection Failed</h2>
            <p className="text-[14px] text-[#8b87a8] mb-6">{error}</p>
            {wsId && (
              <button 
                className="btn-ghost w-full justify-center" 
                onClick={() => navigate(`/dashboard/workspaces/${wsId}/manage`, { replace: true })}
              >
                Back to Settings
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#39FF14] border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-[18px] font-bold text-white mb-2">Connecting to Meta</h2>
            <p className="text-[14px] text-[#8b87a8]">{status}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MetaCallback;
