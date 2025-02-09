module.exports = function (comment) {
    return {
        id: comment._id,
        content: comment.content,
        author: comment.author.login,
        publshedAt: comment.createdAt,
    };
};
