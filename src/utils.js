export const base64decode = (encoded) => {
	let w;

	try {
		w = window;
	} catch (e) {
		// no window
	}
    if (!w || !w.atob) {
        return Buffer.from(encoded, 'base64').toString();
    } else {
        return atob(encoded);
    }
}