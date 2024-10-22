function About() {
    return (
        <div className="p-[20px]">
            <h1 className="text-center text-xl font-bold py-[10px]">About</h1>
            <div >
                <textarea className="w-full h-[200px] bg-neutral-50 p-[15px]" defaultValue="Hello World"></textarea>
            </div>
        </div>
    );
}

export default About;
