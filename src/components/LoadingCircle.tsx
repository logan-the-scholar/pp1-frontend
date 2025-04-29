const LoadingCircle: React.FC<{ size?: number, stroke?: number }> = ({ size = 32, stroke = 8 }) => {
    
    return (
        <div className="relative flex items-center justify-center w-full h-full">
            <div style={{ width: size, height: size }} className="absolute">
                <div
                    style={{ borderWidth: stroke }}
                    className="absolute inset-0 border-gray-500 rounded-full border-t-transparent animate-spin"
                ></div>
            </div>
        </div >
    );
};

export default LoadingCircle;