DROP TABLE IF EXISTS rank;
CREATE TABLE rank (
user_id varchar(128) not null,
user_name varchar(128) not null,
useTime int not null,
create_time datetime not null,
records text,
PRIMARY KEY (user_id)
);

mysql install: http://www.cnblogs.com/bookwed/p/5896619.html