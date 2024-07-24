function Home() {
    return (
        <div className="w-11/12 max-w-7xl min-h-[calc(100vh-68px)] mx-auto flex justify-center items-center">
            <div className="flex flex-col items-center gap-y-3">
                <div className="flex items-center gap-x-2">
                    <div className="font-semibold text-5xl xsm:text-6xl">{`</>`}</div>
                    <div className="font-semibold text-3xl xsm:text-4xl">
                        <span className="text-primary">Code</span>
                        <span>Bliss</span>
                    </div>
                </div>
                <div className="w-full max-w-3xl text-sm xsm:text-base text-center">
                    Your ultimate playground for coding in HTML, CSS, and
                    JavaScript. Enjoy a seamless, interactive experience with
                    instant previews and effortless sharing. Transform your web
                    development ideas into reality with CodeBliss—where
                    creativity meets simplicity.
                </div>
            </div>
        </div>
    );
}

export default Home;
