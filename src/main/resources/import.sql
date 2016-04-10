
-- Users
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (1, 'piet', '1911-11-11', 'piet.pompies@email.com', 'Piet Pompies')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (2, 'johndoe', '1922-02-02', 'john.doe@email.com', 'John Doe')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (3, 'corneil', '1922-10-19', 'corneil@jumpco.io', 'Corneil du Plessis')

-- Groups
insert into sd.groups(id, group_name, description, group_owner) values (1, 'admin-users', 'Administrators', 3)
insert into sd.groups(id, group_name, description, group_owner) values (2, 'developers', 'Developers', 2)

-- Group Members
insert into sd.group_members(member, member_ofgroup, enabled) values (1, 2, 1) -- piet, developers, enabled
insert into sd.group_members(member, member_ofgroup, enabled) values (2, 2, 1) -- johndoe, developers, enabled
insert into sd.group_members(member, member_ofgroup, enabled) values (3, 2, 1) -- corneil, developers, enabled
insert into sd.group_members(member, member_ofgroup, enabled) values (3, 1, 1)  -- corneil, admin-users, enabled
insert into sd.group_members(member, member_ofgroup, enabled) values (2, 1, 0) -- johndoe, admin-users, disabled

