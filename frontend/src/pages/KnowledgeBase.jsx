import React from 'react';

const KnowledgeBase = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 lg:p-12 flex flex-col items-center justify-center">
      <div className="max-w-xl text-center">
        <div className="w-24 h-24 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Base</h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload local agricultural documents, PDFs, and guides here. Our AI will automatically ingest them to provide highly localized answers. 
          <br /><br />
          <span className="font-semibold text-purple-600">Feature Coming Soon!</span>
        </p>
        <button disabled className="bg-gray-300 text-gray-500 font-bold py-4 px-8 rounded-xl cursor-not-allowed text-lg w-full max-w-sm mx-auto shadow-sm">
          Upload Document (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;
