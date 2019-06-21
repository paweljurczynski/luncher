const lunchKeywords = ['zapraszamy', 'krem', 'makaron', 'zupa'];

const isLunchPost = post => lunchKeywords.some(word => post.content.toLowerCase().includes(word));

module.exports = {
    isLunchPost
}
