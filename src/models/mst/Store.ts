import { types as t } from "mobx-state-tree";
import { RouterModel } from 'mst-react-router';
import { User } from "models/mst/User";
import { Post } from "models/mst/Post";
import { Comment } from "models/mst/Comment";

const Store =  t.model({
    users: t.map(User),
    posts: t.map(Post),
    comments: t.map(Comment),
    router: RouterModel
});

export { Store }
