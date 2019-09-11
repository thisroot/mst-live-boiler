import { types as t } from "mobx-state-tree";
import { RouterModel } from 'mst-react-router';
import { User } from "models/mst/User";
import { Post } from "components/Post/Post";
import { Comment } from "components/Comment/Comment";

const Store =  t.model({
    users: t.map(User),
    posts: t.map(Post),
    comments: t.map(Comment),
    router: RouterModel
});

export { Store }
