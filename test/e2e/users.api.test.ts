import request from 'supertest';
import dataBase from '../config/database';
let app;
const agent = request.agent(app);

beforeAll(async () => await dataBase.connect());
//afterEach(async () => await dataBase.clear());
afterAll(async () => await dataBase.close());

describe('blogs', () => {
  it('should return empty array blogs', async () => {
    await agent.get('/blogs').expect(200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });
  it('should create blog', async () => {
    const { statusCode, body } = await agent
      .post('/blogs')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send({
        name: 'qwertyqqq',
        description: 'qwertyqqqq',
        websiteUrl: 'qwerty.com',
      });
    expect(statusCode).toBe(201);
    expect(body).toStrictEqual({
      id: expect.any(String),
      name: 'qwertyqqq',
      description: 'qwertyqqqq',
      websiteUrl: 'qwerty.com',
      createdAt: expect.any(String),
    });
  });
});
describe('blog create and update', () => {
  let id_test: string;
  it('should create a blog', async () => {
    const { statusCode, body } = await agent
      .post('/blogs')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send({
        name: 'Test',
        description: 'test',
        websiteUrl: 'test.com',
      });
    id_test = body.id;
    console.log(id_test);
    expect(statusCode).toBe(201);
    expect(body).toStrictEqual({
      id: expect.any(String),
      name: 'Test',
      description: 'test',
      websiteUrl: 'test.com',
      createdAt: expect.any(String),
    });
  });
  it('should create a post', async () => {
    const { statusCode, body } = await agent
      .post('/posts')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send({
        title: 'TestPost',
        shortDescription: 'TestPostD',
        content: 'TestPost.com',
        blogId: `${id_test}`,
      });
    expect(statusCode).toBe(201);
    expect(body).toStrictEqual({
      id: expect.any(String),
      title: 'TestPost',
      shortDescription: 'TestPostD',
      content: 'TestPost.com',
      blogId: `${id_test}`,
      blogName: 'Test',
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });
  it('should create a post', async () => {
    const { statusCode, body } = await agent
      .post('/posts')
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send({
        title: 'TestPost2',
        shortDescription: 'TestPostD2',
        content: 'TestPost2.com',
        blogId: `${id_test}`,
      });
    expect(statusCode).toBe(201);
    expect(body).toStrictEqual({
      id: expect.any(String),
      title: 'TestPost2',
      shortDescription: 'TestPostD2',
      content: 'TestPost2.com',
      blogId: `${id_test}`,
      blogName: 'Test',
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });
  it('should update the blog', async () => {
    const { statusCode } = await agent
      .put(`/blogs/${id_test}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .send({
        name: 'TestUp',
        description: 'test',
        websiteUrl: 'test.com',
      });
    expect(statusCode).toBe(204);
  });
  it('should return posts with updated blogName', async () => {
    const { statusCode, body } = await agent.get(
      `/blogs/${id_test}/posts?sortDirection=asc`,
    );
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [
        {
          id: expect.any(String),
          title: 'TestPost',
          shortDescription: 'TestPostD',
          content: 'TestPost.com',
          blogId: `${id_test}`,
          blogName: 'TestUp',
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        },
        {
          id: expect.any(String),
          title: 'TestPost2',
          shortDescription: 'TestPostD2',
          content: 'TestPost2.com',
          blogId: `${id_test}`,
          blogName: 'TestUp',
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        },
      ],
    });
  });
});
