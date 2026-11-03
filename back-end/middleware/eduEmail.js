// Require an actual .edu suffix, including university subdomains, not .edu.com.
function isEduEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+edu$/i.test(value.trim());
}
module.exports = { isEduEmail };
