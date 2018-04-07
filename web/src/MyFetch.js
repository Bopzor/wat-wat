const MyFetch = (url, opts) => (
	opts = opts || {};

	return fetch(url, opts)
		.then(res => {
			let promise = null;

			if (res.headers.get('Content-Type') === 'application/json') {
				promise = res.json();
			} else {
				promise = res.text();
			}
			return promise;
		})
			.then(json => {
				return json;
			})
			.catch(error => console.error('Error: ', error));
);