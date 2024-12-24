document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded and parsed');

    try {
        const response = await fetch('/api/user');
        // console.log('Fetch response:', response);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        // console.log('User data:', user);

        if (user) {
            const imageUrl = user._json.picture; 
            console.log('User profile picture URL:', imageUrl); 
            document.getElementById('picture').src = imageUrl; 
            console.log('Image src set to:', document.getElementById('picture').src);
        } else {
            window.location.href = '/login';
        }
    } catch (err) {
        console.error('Error fetching user info:', err);
    }
});

document.getElementById('search').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('search').value;
        console.log('Search query:', query);

        const rightContainer = document.getElementsByClassName('rightcontainer')[0]; 
        if (!rightContainer) {
            console.error('rightContainer not found');
            return; 
        }

        rightContainer.innerHTML = ''; 
        const url = `http://127.0.0.1:5100/result/?query=${query}`;
        const options = {
            method: 'GET',
            headers: {}
        };

        try {
            const response = await fetch(url, options);
            console.log('Fetch response for songs:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Songs result:', result);

            songsArray = [...result];

            result.forEach((song, index) => { 
                const songElement = document.createElement('div');
                songElement.classList.add('song');

                const songPic = document.createElement('img');
                songPic.classList.add('image', `image-${index}`);
                songPic.src = song.image;
                songPic.style.width = '150px';
                songPic.style.height = '150px';
                songPic.setAttribute('tabindex', '0');
                songElement.append(songPic);

                const titleElement = document.createElement('h2');
                titleElement.innerText = song.song; 
                songElement.append(titleElement);

                const audioElement = document.createElement('audio');
                audioElement.classList.add(`audio-${index}`);
                const audioSource = document.createElement('source');
                audioSource.src = song.media_url; 
                audioSource.type = 'audio/mpeg';
                audioElement.appendChild(audioSource);
                songElement.appendChild(audioElement);

                songPic.addEventListener('click', () => {
                    const audio = document.querySelector(`.audio-${index}`);
                    if (audio.paused) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                });

                songPic.addEventListener('keydown', (event) => {
                    if (event.code === 'Space') {
                        event.preventDefault(); 
                        const audio = document.querySelector(`.audio-${index}`);
                        if (audio.paused) {
                            audio.play();
                        } else {
                            audio.pause();
                        }
                    }
                });

                rightContainer.appendChild(songElement);
            });
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }
});
