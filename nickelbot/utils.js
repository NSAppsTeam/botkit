var utils = {};

/**
 * function parseRequestBody
 * param mergeRequest: the json object provided by the gitlab webhook
 */
utils.parseRequestBody = function(mergeRequest) {
    let formattedResponse = {};
    let attr = mergeRequest.object_attributes;
    formattedResponse.merge_request = {
        "id": attr.id,
        "url": attr.source.url,
        "target_branch": attr.target_branch,
        "source_branch": attr.source_branch,
        "created_at": attr.created_at,
        "updated_at": attr.updated_at,
        "title": attr.title,
        "description": attr.description,
        "status": attr.merge_status,
        "work_in_progress": attr.work_in_progress
    };
    let commit = attr.last_commit;
    formattedResponse.last_commit = {
        "id": commit.id,
        "message": commit.message,
        "timestamp": commit.timestamp,
        "url": commit.url,
        "author": commit.author
    };
    formattedResponse.project = {
        "name": attr.target.name,
        "namespace": attr.target.namespace
    };
    formattedResponse.author = {
        "name": mergeRequest.user.name,
        "username": mergeRequest.user.username
    }
    formattedResponse.assignee = {
        "claimed_on_slack": false,
        "name": attr.assignee.name,
        "username": attr.assignee.username
    }
    return formattedResponse;
}

module.exports = utils;
