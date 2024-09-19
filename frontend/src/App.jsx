import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [feed, setFeed] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chat, setChat] = useState([]);
  const [current, setCurrent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFeed(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(feed);

    setSubmitted(true);
  };

  const send = async () => {
    setChat((prev) => [...prev, current]);
    try {
      const response = await fetch("http://localhost:8001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          relation: relation,
          feed: feed,
          message: current,
        }), // Convert request body to JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setChat((prev) => [...prev, data.reply]);
      setCurrent("");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="h-auto flex flex-col justify-center items-center">
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Data Form
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relation
            </label>
            <input
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your relation"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md cursor-pointer file:bg-blue-100 file:text-blue-700 file:border-none file:rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
      {submitted ? (
        <>
          <div className="flex flex-col h-screen w-3/4 rounded-xl bg-gray-100">
            <div className="bg-blue-600 text-white p-4 text-center font-semibold">
              Echoes Box
            </div>

            <div className="flex-1 flex-col overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="w-full h-full flex-col">
                {chat.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 my-2 rounded-md  ${
                      index % 2 === 0
                        ? "self-end bg-blue-100 text-right"
                        : "self-start bg-gray-100"
                    }`}
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-200">
              <input
                type="text"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Type your message..."
              />
              <button
                onClick={send}
                className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
