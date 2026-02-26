document.addEventListener('DOMContentLoaded', () => {
    // --- Image Preview Logic ---
    const fileInput = document.getElementById('imagen');
    const previewContainer = document.getElementById('image-preview');
    const previewImage = previewContainer ? previewContainer.querySelector('img') : null;
    const removeButton = document.getElementById('remove-image');
    const dropZone = document.getElementById('drop-zone');

    if (fileInput && previewContainer && previewImage) {
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewContainer.classList.remove('hidden');
                    dropZone.classList.add('border-green-500');
                }
                reader.readAsDataURL(file);
            } else {
                previewContainer.classList.add('hidden');
                dropZone.classList.remove('border-green-500');
            }
        });

        // Handle remove button
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                fileInput.value = ''; // Clear input
                previewContainer.classList.add('hidden');
                dropZone.classList.remove('border-green-500');
            });
        }

        // --- Drag and Drop Logic ---
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('bg-green-50', 'border-green-500');
        }

        function unhighlight(e) {
            dropZone.classList.remove('bg-green-50', 'border-green-500');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                fileInput.files = files;
                // Trigger change event manually
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        }
    }

    // --- Form Validation ---
    const form = document.getElementById('addForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    // Shake effect
                    field.classList.add('animate-pulse');
                    setTimeout(() => field.classList.remove('animate-pulse'), 500);
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, completa todos los campos obligatorios.');
            }
        });
    }
});
