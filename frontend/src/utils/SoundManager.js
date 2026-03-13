export const SoundManager = {
    sounds: {
        hover: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
        click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
        success: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
        error: new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'),
        pop: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3')
    },

    play(name) {
        try {
            if (this.sounds[name]) {
                const sound = this.sounds[name].cloneNode();
                sound.volume = 0.3; // Lower volume to not be annoying
                sound.play().catch(e => console.log('Audio play failed', e));
            }
        } catch (error) {
            console.error('Sound error:', error);
        }
    }
};
