⁄
XC:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\AuthResponse.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
AuthResponse 
( 
string 

AccessToken 
, 
string 

RefreshToken 
, 
DateTime 
AccessTokenExpiry 
, 
string 

Email 
, 
string 

	FirstName 
, 
string		 

LastName		 
,		 
string

 

Role

 
) 
; ∑
]C:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\CreateTaskRequest.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
CreateTaskRequest 
(  
string 

Title 
, 
string 

Description 
, 
string 

Priority 
, 
string 

Category 
, 
DateTime 
? 
DueDate 
, 
string		 

AssignedToUserId		 
)

 
;

 Æ
XC:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\LoginRequest.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
LoginRequest 
( 
string 

Email 
, 
string 

Password 
) 
; ß
[C:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\RegisterRequest.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
RegisterRequest 
( 
string 

	FirstName 
, 
string 

LastName 
, 
string 

Email 
, 
string 

Password 
) 
; Œ
SC:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\TaskDto.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
TaskDto 
( 
int 
Id 

,
 
string 

Title 
, 
string 

Description 
, 
string 

Priority 
, 
string 

Status 
, 
string		 

Category		 
,		 
DateTime

 
?

 
DueDate

 
,

 
DateTime 
	CreatedAt 
, 
DateTime 
? 
	UpdatedAt 
, 
string 

AssignedToUserId 
, 
string 

AssignedToName 
, 
string 

CreatedByUserId 
, 
string 

CreatedByName 
) 
; ö
ZC:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\TaskSummaryDto.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
TaskSummaryDto 
( 
int 
Pending 
, 
int 

InProgress 
, 
int 
	Completed 
, 
int 
Total 
) 
; Ó
]C:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\DTOs\UpdateTaskRequest.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %
DTOs% )
;) *
public 
record 
UpdateTaskRequest 
(  
string 

Title 
, 
string 

Description 
, 
string 

Priority 
, 
string 

Status 
, 
string 

Category 
, 
DateTime		 
?		 
DueDate		 
,		 
string

 

AssignedToUserId

 
) 
; ù
^C:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\Interfaces\IAuthService.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %

Interfaces% /
;/ 0
public 
	interface 
IAuthService 
{ 
Task 
< 	
AuthResponse	 
> 
RegisterAsync $
($ %
RegisterRequest% 4
request5 <
)< =
;= >
Task 
< 	
AuthResponse	 
> 

LoginAsync !
(! "
LoginRequest" .
request/ 6
)6 7
;7 8
Task		 
<		 	
AuthResponse			 
>		 
RefreshTokenAsync		 (
(		( )
string		) /
refreshToken		0 <
)		< =
;		= >
Task

 
RevokeTokenAsync

	 
(

 
string

  
refreshToken

! -
)

- .
;

. /
} ‡
^C:\Main\10p\Task-Management-Tool\backend\TaskManagement.Application\Interfaces\ITaskService.cs
	namespace 	
TaskManagement
 
. 
Application $
.$ %

Interfaces% /
;/ 0
public 
	interface 
ITaskService 
{ 
Task 
< 	
IReadOnlyList	 
< 
TaskDto 
> 
>  
GetAllTasksAsync! 1
(1 2
string2 8
userId9 ?
,? @
stringA G
roleH L
)L M
;M N
Task 
< 	
TaskDto	 
? 
> 
GetTaskByIdAsync #
(# $
int$ '
id( *
,* +
string, 2
userId3 9
,9 :
string; A
roleB F
)F G
;G H
Task		 
<		 	
TaskDto			 
>		 
CreateTaskAsync		 !
(		! "
CreateTaskRequest		" 3
request		4 ;
,		; <
string		= C
createdByUserId		D S
)		S T
;		T U
Task

 
<

 	
TaskDto

	 
>

 
UpdateTaskAsync

 !
(

! "
int

" %
id

& (
,

( )
UpdateTaskRequest

* ;
request

< C
,

C D
string

E K
userId

L R
,

R S
string

T Z
role

[ _
)

_ `
;

` a
Task 
DeleteTaskAsync	 
( 
int 
id 
,  
string! '
userId( .
,. /
string0 6
role7 ;
); <
;< =
Task 
< 	
TaskSummaryDto	 
> 
GetTaskSummaryAsync ,
(, -
string- 3
userId4 :
,: ;
string< B
roleC G
)G H
;H I
} 