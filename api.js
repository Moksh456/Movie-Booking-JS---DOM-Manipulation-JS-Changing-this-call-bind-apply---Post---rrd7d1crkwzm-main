export const database = [
    { name: '21 Jump Street', imgUrl: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRLCqM8Ispa4waG8tNLPdy6rtiJFOEZUZxdzP-y_BQzfgo953Gb', Date: `11-01-2024`, languege: `hindi`, hero: `Vjay`, rate: `250 INR`},
    { name: '22 Jump Street', imgUrl: 'https://th.bing.com/th/id/R.9afb01c901dc6961a1d5646c68499b0b?rik=Liz06t7468JG2Q&riu=http%3a%2f%2fwww.impawards.com%2fintl%2findia%2f2023%2fposters%2fanimal.jpg&ehk=dOQrr30Ru%2bAqRVnRqtpScvj16xZKDKr8slmu1mAlbqk%3d&risl=&pid=ImgRaw&r=0',Date: `01-08-2026`, languege: `english`, hero: `Shiva ji`, rate: `250 INR` },
    { name: 'Cars', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/34/Cars_2006.jpg', Date: `02-08-2008`, languege: `tamil`, hero: `Radhika`, rate: `250 INR`},
    { name: 'Cars 2', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Cars_2_Poster.jpg', Date: `12-12-2005`, languege: `hindi`, hero: `Ajay devgan`, rate: `250 INR` },
    { name: 'Cars 3', imgUrl: 'https://image.tmdb.org/t/p/original/riNhv1BdFSCSiIxAtGmFM9yrhms.jpg',Date: `05-04-2009`, languege: `hindi`, hero: `Amitab Bacchan`, rate: `250 INR` }
]
export const availibility = {
    '21 Jump Street': [1, 2, 5, 8, 9,19,22,20,11],
    '22 Jump Street': [1, 2, 3, 5, 6,10,11,12,13,14,15,16,17, 24],
    'Cars': [1, 2, 3, 4, 5, 6,15,16,17,18,19,20,21,22,23,24],
    'Cars 2': [4, 6, 8,10,11,12,13,14,15,16],
    'Cars 3': [3, 5, 7, 9,20,21,12,13,19,24]
}
const fetchMovieList = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(database)
        }, 500)
    })
}

const fetchMovieAvailability = async (movieName) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const m in availibility) {
                if (m === movieName) resolve(availibility[m])
            }
            resolve([])
        }, 500)
    })
}

export { fetchMovieList, fetchMovieAvailability }