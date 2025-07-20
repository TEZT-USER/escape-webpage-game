//
// Client‑side logic for the escape‑the‑webpage game. This script wires up
// click handlers for each puzzle and exposes a function on the global object
// that the player must call from their browser's console to advance. It also
// issues a network request when appropriate so that curious players can
// inspect the Network tab for clues.

(() => {
  /**
   * Helper to show a particular stage and hide all others. Every stage is
   * represented by a <section> element with an id of the form `stageX` where X
   * is a number. The victory screen has the id `victory`.
   *
   * @param {string} id The id of the stage to show.
   */
  function showStage(id) {
    const stages = document.querySelectorAll('.stage');
    stages.forEach(section => {
      if (section.id === id) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }

  /** Stage 1: Validate the 4‑digit code. */
  function checkCode() {
    const val = document.getElementById('codeInput').value.trim();
    if (val === '5318') {
      showStage('stage2');
    } else {
      alert('Incorrect code! Try looking at the page source (Ctrl+U or Cmd+Option+U).');
    }
  }

  /** Stage 2: Validate the hidden word (case‑insensitive). */
  function checkWord() {
    const val = document.getElementById('wordInput').value.trim().toUpperCase();
    if (val === 'REVEAL') {
      showStage('stage3');
    } else {
      alert('Not quite! Did you highlight the blank area or inspect the CSS?');
    }
  }

  /**
   * Stage 3: Exposed function for players to call from the browser console. When
   * invoked it will transition to stage 4 and fetch an external clue. Because
   * this function is attached to the global object (window) players can
   * call it directly from their console.
   */
  function escapeNext() {
    showStage('stage4');
    // Fetch a small text file to show up in the Network panel. The content of
    // the file contains the final key. We intentionally ignore any errors here
    // because this call is purely for the player's benefit.
    fetch('clue.txt', { cache: 'no-cache' })
      .then(resp => resp.text())
      .then(text => {
        // The clue is never displayed on the page — players must inspect
        // the network response to discover it. However, we still store it
        // in a variable in case we want to use it later.
        window.__finalClue = text.trim();
      })
      .catch(() => {
        // Nothing to do; this will only appear in the Network tab.
      });
  }

  /** Stage 4: Validate the final key. */
  function checkFinal() {
    const val = document.getElementById('finalInput').value.trim().toUpperCase();
    // The final key is EXIT; players should retrieve this from clue.txt but we
    // hard‑code it here for validation.
    if (val === 'EXIT') {
      showStage('victory');
    } else {
      alert("That key doesn't unlock the door. Check the Network tab for the file clue.txt.");
    }
  }

  // Attach event listeners once the DOM is fully loaded.
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('codeSubmit').addEventListener('click', checkCode);
    document.getElementById('wordSubmit').addEventListener('click', checkWord);
    document.getElementById('finalSubmit').addEventListener('click', checkFinal);
  });

  // Expose escapeNext globally so the player can call it from the console.
  window.escapeNext = escapeNext;
})();
