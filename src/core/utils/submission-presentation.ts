import { environment } from '../../environments/environment';

/** Attachment shape we render in the UI (normalized). */
export interface SubmissionFile {
  id: string;
  name: string;
  url: string;
}

type Json = Record<string, any>;

/**
 * Reads the submission of an assignee row, tolerating alternate backend keys
 * (submission / task_submission / submission_data).
 */
export function submissionOfAssignee(assignee: Json | null | undefined): any | null {
  if (!assignee) return null;
  const raw = assignee['submission'] ?? assignee['task_submission'] ?? assignee['submission_data'];
  return raw ?? null;
}

/** Builds an absolute URL for attachments that the backend stores as relative paths. */
export function absoluteFileUrl(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${environment.apiUrl}/${url.replace(/^\/+/, '')}`;
}

/**
 * Normalizes the attachment list of a submission. The API has used several
 * container keys (task_submission_attachments / attachments / files) and
 * several url keys (file_url / url / file_path) — handle all of them.
 */
export function submissionFiles(submission: Json | null | undefined): SubmissionFile[] {
  if (!submission) return [];
  const rawList =
    submission['task_submission_attachments'] ??
    submission['attachments'] ??
    submission['files'] ??
    submission['submission_attachments'] ??
    [];
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item: Json, index: number): SubmissionFile => {
      const url: string = item?.['file_url'] ?? item?.['url'] ?? item?.['file_path'] ?? item?.['path'] ?? '';
      const name: string =
        item?.['file_name'] ?? item?.['name'] ?? item?.['filename'] ?? (url ? url.split('/').pop() ?? '' : '');
      return {
        id: String(item?.['id'] ?? index),
        name: name || 'file',
        url: absoluteFileUrl(url),
      };
    })
    .filter((f) => f.url !== '');
}
