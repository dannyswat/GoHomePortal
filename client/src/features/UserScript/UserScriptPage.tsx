import { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { copilot } from "@uiw/codemirror-theme-copilot";
import { UserScript } from "./UserScript";
import {
  getAllUserScripts,
  getUserScript,
  saveUserScript,
} from "./userScriptApi";

function UserScriptPage() {
  const [scripts, setScripts] = useState<UserScript[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<string>("");
  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [scriptContent, setScriptContent] = useState<string>(
    "// Select a script or start coding..."
  );
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all scripts for the dropdown on mount
  useEffect(() => {
    setIsLoading(true);
    getAllUserScripts()
      .then((data) => {
        setScripts(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch scripts:", err);
        setError("Failed to load scripts.");
        setScripts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch script content when dropdown selection changes
  useEffect(() => {
    if (!selectedScriptId) {
      setScriptContent("// Select a script...");
      setScriptTitle("");
      return;
    }
    setIsLoading(true);
    getUserScript(selectedScriptId)
      .then((script) => {
        setScriptContent(script.script);
        setScriptTitle(script.title);
        // Optionally load input schema or other details
        setError(null);
      })
      .catch((err) => {
        console.error(`Failed to fetch script ${selectedScriptId}:`, err);
        setError(`Failed to load script: ${selectedScriptId}`);
        setScriptContent("// Error loading script");
      })
      .finally(() => setIsLoading(false));
  }, [selectedScriptId]);

  const handleScriptChange = useCallback((value: string) => {
    setScriptContent(value);
  }, []);

  const handleExecute = () => {
    // !!! SECURITY WARNING !!!
    // Executing arbitrary code fetched from a server or entered by a user
    // directly in the browser (e.g., using eval() or new Function()) is extremely dangerous
    // and can lead to Cross-Site Scripting (XSS) attacks.
    // A secure implementation requires server-side execution in a sandboxed environment.
    //
    // For demonstration purposes, this will just log and set placeholder output.
    console.log("Executing script (simulation):");
    console.log("--- Script ---");
    console.log(scriptContent);
    console.log("--- Input ---");
    console.log(inputText);
    setOutputText(
      `Simulated execution with input:\n${inputText}\n\n(Actual execution requires a secure backend implementation)`
    );
    setError(null);
  };

  const handleCopyOutput = () => {
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        // Optional: Show a temporary success message
        console.log("Output copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy output: ", err);
        setError("Failed to copy output to clipboard.");
      });
  };

  // Function to handle saving a script
  const handleSaveScript = async () => {
    if (!scriptTitle.trim()) {
      setError("Please enter a title for the script.");
      return;
    }

    setIsLoading(true);
    try {
      const scriptData = {
        title: scriptTitle,
        script: scriptContent,
        inputSchema: "{}", // Default empty schema
      };

      const savedScript = await saveUserScript(scriptData);

      // Update scripts list with the new script
      setScripts((prevScripts) => {
        if (prevScripts.some((s) => s.uniqueId === savedScript.uniqueId)) {
          // Update existing script
          return prevScripts.map((s) =>
            s.uniqueId === savedScript.uniqueId ? savedScript : s
          );
        } else {
          // Add new script
          return [...prevScripts, savedScript];
        }
      });

      // Select the newly saved script
      setSelectedScriptId(savedScript.uniqueId);
      setError(null);
    } catch (err) {
      console.error("Failed to save script:", err);
      setError("Failed to save script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="script-select"
            className="block text-sm font-medium text-gray-700"
          >
            Load Script:
          </label>
          <select
            id="script-select"
            value={selectedScriptId}
            onChange={(e) => setSelectedScriptId(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select a Script --</option>
            {scripts.map((script) => (
              <option key={script.uniqueId} value={script.uniqueId}>
                {script.title} ({script.uniqueId.substring(0, 6)}...)
              </option>
            ))}
          </select>
          {isLoading && (
            <span className="text-sm text-gray-500"> Loading...</span>
          )}
        </div>

        <div className="flex items-center space-x-2 flex-1/2">
          <label
            htmlFor="script-title"
            className="block text-sm font-medium text-gray-700"
          >
            Title:
          </label>
          <input
            id="script-title"
            type="text"
            value={scriptTitle}
            onChange={(e) => setScriptTitle(e.target.value)}
            placeholder="Enter script title..."
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          />
          <button
            onClick={handleSaveScript}
            disabled={isLoading || !scriptTitle.trim()}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1/2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Script Editor:
          </label>
          <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <CodeMirror
              value={scriptContent}
              height="300px"
              theme={copilot}
              extensions={[javascript({ jsx: true })]}
              onChange={handleScriptChange}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="input-textarea"
            className="block text-sm font-medium text-gray-700"
          >
            Input:
          </label>
          <textarea
            id="input-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="mt-1 block w-full h-[300px] shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter input for the script..."
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Execute Script
        </button>
      </div>

      <div>
        <label
          htmlFor="output-textarea"
          className="block text-sm font-medium text-gray-700"
        >
          Output:
        </label>
        <textarea
          id="output-textarea"
          value={outputText}
          readOnly
          rows={5}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
          placeholder="Script output will appear here..."
        />
      </div>

      <div>
        <button
          onClick={handleCopyOutput}
          disabled={!outputText || isLoading}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy Output
        </button>
      </div>
    </div>
  );
}

export default UserScriptPage;
