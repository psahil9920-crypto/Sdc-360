import { getAccessToken } from './auth';
import { DriveCampusFile } from '../types';

export const OFFICIAL_CAMPUS_DOCS: DriveCampusFile[] = [
  {
    id: 'sd-doc-1',
    name: 'BCA 2026-2030 Complete Curriculum & Credit Structure.pdf',
    mimeType: 'application/pdf',
    size: '2.4 MB',
    modifiedTime: '2026-09-15T10:30:00Z',
    source: 'campus-repository',
    category: 'Syllabus',
    semester: 'All Semesters',
  },
  {
    id: 'sd-doc-2',
    name: 'Cloud Computing & Distributed Systems - Unit 1 to 4 Notes.docx',
    mimeType: 'application/vnd.google-apps.document',
    size: '1.8 MB',
    modifiedTime: '2026-09-28T14:15:00Z',
    source: 'campus-repository',
    category: 'Lecture Notes',
    semester: 'Semester 6',
  },
  {
    id: 'sd-doc-3',
    name: 'Advanced Web Architecture & AI Engineering - Lab Manual.pdf',
    mimeType: 'application/pdf',
    size: '4.1 MB',
    modifiedTime: '2026-09-20T09:00:00Z',
    source: 'campus-repository',
    category: 'Lab Manual',
    semester: 'Semester 6',
  },
  {
    id: 'sd-doc-4',
    name: 'BCA Previous 5 Years Midterm & Finals Question Bank.pdf',
    mimeType: 'application/pdf',
    size: '5.6 MB',
    modifiedTime: '2026-09-10T16:45:00Z',
    source: 'campus-repository',
    category: 'Question Bank',
    semester: 'Semester 6',
  },
  {
    id: 'sd-doc-5',
    name: 'SD CodeCraft Club - Hackathon 2030 Problem Statements & Guidelines.pdf',
    mimeType: 'application/pdf',
    size: '1.2 MB',
    modifiedTime: '2026-10-01T11:20:00Z',
    source: 'campus-repository',
    category: 'Lecture Notes',
    semester: 'All Semesters',
  },
  {
    id: 'sd-doc-6',
    name: 'Campus IT & Wi-Fi Policy & Ramanujan Lab Guidelines 2026.pdf',
    mimeType: 'application/pdf',
    size: '890 KB',
    modifiedTime: '2026-08-25T13:10:00Z',
    source: 'campus-repository',
    category: 'Syllabus',
    semester: 'All Semesters',
  },
];

export async function fetchUserDriveFiles(): Promise<DriveCampusFile[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=25&fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime)&q=trashed=false',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Drive files fetch response not ok:', res.status, err);
      return [];
    }

    const data = await res.json();
    if (!data.files) return [];

    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      size: file.size ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB` : 'Cloud File',
      modifiedTime: file.modifiedTime,
      source: 'google-drive',
      category: 'Personal',
    }));
  } catch (error) {
    console.error('Failed to fetch Drive files:', error);
    return [];
  }
}

export async function createDriveTextNote(title: string, content: string): Promise<DriveCampusFile | null> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google Drive authentication is required to create files');

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: title.endsWith('.txt') ? title : `${title}.txt`,
    mimeType: 'text/plain',
    description: 'Created via SD Campus 360 Smart Campus Platform',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain\r\n\r\n' +
    content +
    closeDelim;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to upload to Google Drive: ${errorText}`);
  }

  const createdFile = await res.json();
  return {
    id: createdFile.id,
    name: createdFile.name,
    mimeType: 'text/plain',
    source: 'google-drive',
    category: 'Personal',
    modifiedTime: new Date().toISOString(),
    size: `${(content.length / 1024).toFixed(1)} KB`,
  };
}

export async function deleteDriveFile(fileId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete file from Google Drive');
  }

  return true;
}
