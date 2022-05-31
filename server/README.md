## Database tables

### User

- **user_id**
- First name
- Last name
- Roll number
- Current semester
- Branch
- Bio
- Interest [array]
- Graduation year
- Avatar
- Social links [array] (app name, url)
- Hometown
- Skill [array]

### Event Showcase

- **event_id**
- Department
- Tags [array]
- Image/Video Link
- Registration link
- Website link

### Bookmarks

- **bookmark_id**
- _user_id_
- _projects_id_ [array]
- _blog_id_ [array]
- _question_id_ [array]

### Questions

- **question_id**
- _reply_id_ [array]
- _user_id_
- _comment_id_ [array]
- Date-time
- _accepted_reply_id_
- Question
- Vote

### Replies

- **reply_id**
- _question_id_
- _user_id_
- _comment_id_ [array]
- Answer
- Date-time

### Comments

- **comment_id**
- _user_id_
- Comment

### Followers

- **follower_id**
- _user_id_
- _follow_id_

### User Chat

- **user_chat_id**
- _user_id_
- _chat_id_
- Private key
- Public key

### Chat

- **chat_id**
- Name
- _message_id_ [array]

### Message

- **message_id**
- _user_id_
- Date-time
- Message
