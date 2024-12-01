function NestedB() {
    return (
        <div className="mx-10 p-10 bg-gray-100 rounded-lg min-h-[200px]">
            <div className="text-md font-bold py-[10px]">NestedB</div>
            <p className="text-sm text-gray-500 mb-2">This is a nested route. It will be cached.</p>
            <input type="text" className="border border-gray-300 rounded-md p-1 px-2" placeholder="input text" />
        </div>
    );
}

export default NestedB;
