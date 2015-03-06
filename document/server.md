Event 'connection'
Handle Event: Server
Send Event: Client
Upload Data:
Example:
{
	"query": {
		"token" : "00000000",
		"user_id" : "001",
		"user_name" "Jones Hsu"
	}
}

Event 'authorizationFailure'
Handle Event: Client
Send Event: Server
Upload Data:
{
	"error_code" : "0",
	"error_result" : "authorization failure" 
}

{
	"error_code" : "1",
	"error_result" : "parameter missing"
}


Event 'joinRoom'
Handle Event: Server
Send Event: Client
Upload Data:
Example:(1)
{
	"room_id" : "s_00001",
	"member_id" : "",
	"member_name" : "", 
}

Example:(2)
{
	"room_id" : "",
	"member_id" : "002",
	"member_name" : "Brad Lan"
}

Event 'joinRoomSuccess'
Handle Event: Client
Send Event: Server
Upload Data:
{
	"room_id" : "s_00001",
	"member_message_record" : [
		{
			"member_id" : "001",
			"init_message_id" : "0",
			"last_message_id" : "3"
		},
		...
	],
	"message_list" : [
		{
			"message_id" : "1",
			"sender_id" : "001",
			"sender_name" : "Jones Hsu",
			"content" : "Test Test",
			"read_count" : "1",
			"time" : "2015-3-5 11:9"
		}, {
			"message_id" : "2",
			"sender_id" : "002",
			"sender_name" : "Brad Lan",
			"content" : "Hello",
			"read_count" : "0",
			"time" : "2015-3-5 11:10"
		}
	]
}

Event 'sendMessage'
Source : Client to Server
Upload Data { 
			  "id" : "$id",
			  "sender_id" : "$sender_id",
			  "sender_name" : "$sender_name",
			  "content" : "$content",
			  "time" : "$time" }

Event 'sendMessageFailure'
Source : Server to Client
Upload Data {
				"error_code" : $error_code
				error_code = 0 // sender_id or sender_name or time is null
			}

Event 'receiveMessage'
Source : Server to Client
Upload Data {
				"sender_id" : "$sender_id",
				"sender_name" : "$sender_name",
				"content" : "$content"
			}