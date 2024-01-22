CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    name text,
    passwordHash text NOT NULL
);

INSERT INTO users (username, name, passwordHash) VALUES 
('admin', 'Admin', '$2b$10$vvtQuEfx9YnIAUHQzaVxg.1xx8oJ532DJ7T7Nn93J6Hdw3I01RscW'),
('root', 'Root', '$2b$10$o10O1IBivv3u//9VEu4/su65J0UQtnsnnbUvBIF42vdw/UAoL8/Uq');

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text NOT NULL,
    title text NOT NULL UNIQUE,
    url text NOT NULL UNIQUE,
    likes integer NOT NULL,
    comments text[],
    user_id integer REFERENCES users(id)
);

INSERT INTO blogs (author, title, url, likes, comments, user_id)
VALUES ('Michael Chan', 'React patterns', 'https://reactpatterns.com/', 7, 1),
       ('Michael Chan', 'Go To Statement Considered Harmful', 'https://reactpatterns.com/', 5, 1),
       ('Edsger W. Dijkstra', 'Canonical string reduction', 'http://example.com', 12, ["good"], 2),

