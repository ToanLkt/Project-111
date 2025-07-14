import React from 'react';

const SessionLoader = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, #F2EFE7 60%, #9ACBD0 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
        >
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid #9ACBD0',
                    borderTop: '4px solid #006A71',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}
            />
            <p
                style={{
                    color: '#006A71',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: 0
                }}
            >
                Đang khôi phục phiên đăng nhập...
            </p>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SessionLoader;
