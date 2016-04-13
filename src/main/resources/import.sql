
-- Users
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (1, 'yoda', '1011-2-1', 'yoda@dagoba.galaxy', 'Yoda')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (2, 'luke', '1977-11-11', 'luke.skywalker@tatooine.galaxy', 'Luke Skywalker')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (3, 'ben', '1935-3-4', 'ben.kenobi@tatooine.galaxy', 'Obi-Wan Kenobi')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (4, 'anakin', '1956-6-6', 'darth.vader@empire.galaxy', 'Dath Vader')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (5, 'emperor', '1916-4-9', 'emperor.palpetine@empire.galaxy', 'Emperor Palpetine')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (6, 'jango', '1939-3-18', 'jango.fett@mandalora.galaxy', 'Jango Fett')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (7, 'boba', '1962-8-1', 'boba.fett@mandalora.galaxy', 'Boba Fett')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (8, 'leia', '1977-11-11', 'leia.organa@alderaan.galaxy', 'Leia Organa')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (9, 'han', '1968-7-3', 'han.solo@corellia.galaxy', 'Han Solo')
insert into sd.users(id, user_id, date_of_birth, email_address, full_name) values (10, 'padme', '1959-9-3', 'padme.amidala@naboo.galaxy', 'Padme Amidala')

-- Groups
insert into sd.groups(id, group_name, description, group_owner) values (1, 'jedi-masters', 'Jedi Masters', 1)
insert into sd.groups(id, group_name, description, group_owner) values (2, 'jedi-knights', 'Jedi Knights', 3)
insert into sd.groups(id, group_name, description, group_owner) values (3, 'sith', 'Sith', 4)
insert into sd.groups(id, group_name, description, group_owner) values (4, 'empire', 'Galactic Empire', 5)
insert into sd.groups(id, group_name, description, group_owner) values (5, 'mandalorians', 'Mandalorians', 6)
insert into sd.groups(id, group_name, description, group_owner) values (6, 'rebels', 'Rebel Alliance', 8)
insert into sd.groups(id, group_name, description, group_owner) values (7, 'naboo', 'Naboo Royal House', 8)
insert into sd.groups(id, group_name, description, group_owner) values (8, 'republic', 'Old Republic', 5)

-- Group Members
insert into sd.group_members(member, member_ofgroup, enabled) values (1, 1, 1) -- yoda, jedi-knights
insert into sd.group_members(member, member_ofgroup, enabled) values (1, 2, 1) -- yoda, jedi-masters
insert into sd.group_members(member, member_ofgroup, enabled) values (2, 1, 1) -- luke, jedi-knights
insert into sd.group_members(member, member_ofgroup, enabled) values (3, 1, 1) -- ben, jedi-knights
insert into sd.group_members(member, member_ofgroup, enabled) values (3, 2, 1) -- ben, jedi-masters
insert into sd.group_members(member, member_ofgroup, enabled) values (4, 3, 1) -- anakin, sith
insert into sd.group_members(member, member_ofgroup, enabled) values (5, 3, 1) -- emperor, sith

insert into sd.group_members(member, member_ofgroup, enabled) values (4, 4, 1) -- anakin, empire
insert into sd.group_members(member, member_ofgroup, enabled) values (5, 4, 1) -- emperor, empire

insert into sd.group_members(member, member_ofgroup, enabled) values (10, 7, 1) -- padme, naboo

insert into sd.group_members(member, member_ofgroup, enabled) values (5, 8, 1) -- emperor, republic
insert into sd.group_members(member, member_ofgroup, enabled) values (10, 8, 1) -- padme, republic

insert into sd.group_members(member, member_ofgroup, enabled) values (6, 5, 1) -- jango, mandalorians
insert into sd.group_members(member, member_ofgroup, enabled) values (7, 5, 1) -- boba, mandalorians

insert into sd.group_members(member, member_ofgroup, enabled) values (8, 6, 1) -- leia, rebels
insert into sd.group_members(member, member_ofgroup, enabled) values (9, 6, 1) -- han, rebels
