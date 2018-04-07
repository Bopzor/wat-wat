/**
 * Request to Wat-Wat API :
 *
 */



function myFetch(url, opts) {
	console.log(url, opts);

	return fetch(url, opts)
		.then(res => {
			let promise = null;
			const contentType = res.headers.get('Content-Type');

			if (/^application\/json/.exec(contentType)) {
				promise = res.json();
			} else if (/^text/.exec(contentType)) {
				promise = res.text();
			}

			return promise;
		})
		.catch(error => {
			console.error('Error:', error)
			throw error;
		});
}

function requestWatWatApi(url, opts) {
	opts = opts || {};

	return myFetch(url, opts);
}

function requestOMDB(url, opts) {
	opts = opts || {};

	return myFetch(url, opts);
}

export default {
	requestWatWatApi,
	requestOMDB,
};