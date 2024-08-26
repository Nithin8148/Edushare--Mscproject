import { listDocuments } from './actions/documentActions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const dispatch = useDispatch();
const documentList = useSelector((state) => state.documentList);
const { loading, error, documents } = documentList;

useEffect(() => {
  dispatch(listDocuments());
}, [dispatch]);

if (loading) {
  document.getElementById('uploaded-documents').innerHTML = 'Loading...';
} else if (error) {
  document.getElementById('uploaded-documents').innerHTML = `Error: ${error}`;
} else {
  const documentContainer = document.getElementById('uploaded-documents');
  documentContainer.innerHTML = '';
  documents.forEach((document) => {
    const div = document.createElement('div');
    div.className = 'text-center';
    div.innerHTML = `
      <img src="${document.file_path}" alt="Document Image" class="w-full h-48 object-cover rounded-lg shadow-lg mb-4 border-2 border-gray-200">
      <p class="text-gray-700 font-semibold">${document.name}</p>
    `;
    documentContainer.appendChild(div);
  });
}
