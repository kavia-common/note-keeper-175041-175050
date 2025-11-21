#!/bin/bash
cd /home/kavia/workspace/code-generation/note-keeper-175041-175050/notes_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

