/**
 * Component 12: note
 * Speaker notes wrapper for adding structured presenter notes to slides.
 */

import { Theme } from '../design/theme';

export interface NoteOptions {
  notes: string | string[];
  theme?: Theme;
}

export function note(options: NoteOptions): string {
  if (typeof options.notes === 'string') {
    return options.notes.trim();
  }

  return options.notes.map((item) => `• ${item}`).join('\n');
}
