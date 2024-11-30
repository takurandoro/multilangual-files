const request = require('supertest');
const { it, describe, expect, beforeAll, afterAll } = require('@jest/globals');
const app = require('../app'); // Adjust this path to where your app is exported

describe('Files Manager App', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000); // Use a different port to avoid conflicts
  });

  afterAll(() => {
    server.close();
  });

  it('should return Files Manager API', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Welcome to Files Manager API');
  });

  it('should return a list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('List of users');
  });

  it('should create a new file', async () => {
    const newFile = { filename: 'file1.txt', filepath: '/path/to/file1.txt' };
    const res = await request(app).post('/files').send(newFile);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newFile);
  });

  it('should return all files', async () => {
    const res = await request(app).get('/api/files');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should return a single file by filename', async () => {
    const res = await request(app).get('/files/file1.txt');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      filename: 'file1.txt',
      filepath: '/path/to/file1.txt',
    });
  });

  it('should update a file by filename', async () => {
    const updatedFile = { filepath: '/new/path/to/file1.txt' };
    const res = await request(app).put('/files/file1.txt').send(updatedFile);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      filename: 'file1.txt',
      filepath: '/new/path/to/file1.txt',
    });
  });

  it('should delete a file by filename', async () => {
    const res = await request(app).delete('/files/file1.txt');
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 for non-existent file', async () => {
    const res = await request(app).get('/files/nonexistent.txt');
    expect(res.statusCode).toEqual(404);
  });

  // User tests
  it('should create a new user', async () => {
    const newUser = { username: 'user1', password: 'password1' };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newUser);
  });

  it('should not create a user that already exists', async () => {
    const newUser = { username: 'user1', password: 'password1' };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('User already exists');
  });

  it('should login successfully with valid credentials', async () => {
    const credentials = { username: 'user1', password: 'password1' };
    const res = await request(app).post('/login').send(credentials);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Login successful');
  });

  it('should not login with invalid credentials', async () => {
    const credentials = { username: 'user1', password: 'wrongpassword' };
    const res = await request(app).post('/login').send(credentials);
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Invalid credentials');
  });
});
