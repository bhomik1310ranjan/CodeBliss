function Loader() {
    return (
        <div className="w-full h-screen overflow-hidden flex justify-center items-center">
            <div className="relative inline-flex">
                <div className="w-12 aspect-square bg-primary rounded-full"></div>
                <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-12 aspect-square bg-primary rounded-full absolute top-0 left-0 animate-pulse"></div>
            </div>
        </div>
    );
}

export default Loader;
