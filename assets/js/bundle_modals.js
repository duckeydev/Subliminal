document.addEventListener("DOMContentLoaded", () => {
  window.closeModal = function() {
    const modalContainer = document.getElementById('modal-container');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    
    // Add transition classes for closing the modal
    modalBackdrop.classList.add('opacity-0', 'transition-opacity', 'ease-in', 'duration-200');
    modalPanel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95', 'transition-all', 'ease-in', 'duration-200');
    
    // Wait for the transition to finish before removing the modal
    setTimeout(() => {
      modalContainer.innerHTML = ''; // Clear the modal content
    }, 200); // 200ms duration to match the transition time
  }

  window.loadModal = function(type, message, simpleClose, scriptFunct) {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = ''; // Clear previous content
    }

    const modal = document.createElement('div');
    modal.classList.add("relative", "z-10");
    modal.setAttribute("aria-labelledby", "modal-title");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="fixed inset-0 bg-neutral-800 filter backdrop-blur-md bg-opacity-75 transition-opacity ease-out duration-300 opacity-0" id="modal-backdrop"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto transition-transform ease-out duration-300 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" id="modal-panel">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-neutral-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button type="button" class="rounded-md bg-neutral-800 text-neutral-200 hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onclick="closeModal()">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getIconBackground(type)} sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 ${getIconColor(type)}" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  ${getIconPath(type)}
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-neutral-200" id="modal-title">${getModalTitle(type)}</h3>
                <div class="mt-2">
                  <p class="text-sm text-neutral-400">${message}</p>
                </div>
              </div>
            </div>

            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              ${simpleClose ? '' : `
                <button type="button" onclick="${scriptFunct}()" class="inline-flex w-full justify-center rounded-md bg-${getButtonColor(type)} px-3 py-2 text-sm font-semibold text-neutral-300 shadow-sm hover:bg-${getButtonColorHover(type)} sm:ml-3 sm:w-auto">
                  ${getButtonLabel(type)}
                </button>
              `}
              <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-neutral-700 px-3 py-2 text-sm font-semibold text-neutral-300 shadow-sm hover:bg-neutral-700/55 sm:mt-0 sm:w-auto" onclick="closeModal()">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modalContainer.appendChild(modal);

    // Trigger the modal transition (appear)
    setTimeout(() => {
      document.getElementById('modal-backdrop').classList.remove('opacity-0');
      document.getElementById('modal-backdrop').classList.add('opacity-100');
      document.getElementById('modal-panel').classList.remove('opacity-0', 'translate-y-4', 'sm:scale-95');
      document.getElementById('modal-panel').classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
    }, 10);
  }

  // Helper functions for customizing modal
  function getModalTitle(type) {
    switch (type) {
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'success': return 'Success';
      case 'info': return 'Information';
      default: return 'Notification';
    }
  }

  function getIconBackground(type) {
    switch (type) {
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      case 'success': return 'bg-green-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  function getIconColor(type) {
    switch (type) {
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }

  function getIconPath(type) {
    switch (type) {
      case 'warning': return `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`;
      case 'error': return `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`;
      case 'success': return `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4 -4" />`;
      case 'info': return `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0 0H9m3 0h3" />`;
      default: return '';
    }
  }

  function getButtonColor(type) {
    switch (type) {
      case 'warning': return 'yellow-600';
      case 'error': return 'red-600';
      case 'success': return 'green-600';
      case 'info': return 'blue-600';
      default: return 'gray-600';
    }
  }

  function getButtonColorHover(type) {
    switch (type) {
      case 'warning': return 'yellow-500';
      case 'error': return 'red-500';
      case 'success': return 'green-500';
      case 'info': return 'blue-500';
      default: return 'gray-500';
    }
  }

  function getButtonLabel(type) {
    switch (type) {
      case 'warning': return 'Proceed';
      case 'error': return 'Try Again';
      case 'success': return 'Close';
      case 'info': return 'Got it';
      default: return 'Okay';
    }
  }
});