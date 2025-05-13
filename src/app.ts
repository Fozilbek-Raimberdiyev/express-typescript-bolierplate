import express, { Express, Request, Response } from "express";
import { Tspec, TspecDocsMiddleware } from "tspec";
const app: Express = express();
const port = process.env.PORT || 3000;
interface Book {
  /** Field description defined by JSDoc */
  id: number;
  title: string;
  description?: string;
}
const getBookById = (req: Request<{ id: string }>, res: Response<Book>) => {
  res.json({
    id: +req.params.id,
    title: "Book Title",
    description: "Book Description",
  });
};

export type BookApiSpec = Tspec.DefineApiSpec<{
  tags: ["Book"];
  paths: {
    "/books/{id}": {
      get: {
        summary: "Get book by id";
        responses: {
          200: Book;
        }
      };
    };
    "/books" : {
      post : {
        description : "Create book",
        body : Book,
        handler : (req : Request, res : Response) => void
        responses : {
          200 : Book[]
        }
      }
    };
  };
}>;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asosiy yo'l (route)
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript serveri muvaffaqiyatli ishga tushdi!");
});

async function bootstrap() {
  app.get("/books/:id", getBookById);
  app.use("/docs", await TspecDocsMiddleware({openapi : {title : "Book API", version : "1.0.0", description : "Book API documentation", securityDefinitions : {Bearer : {type : "apiKey", name : "Authorization", in : "header"}}}})); // Serverni ishga tushirish
  app.listen(port, () => {
    console.log(
      `⚡️[server]: Server http://localhost:${port} portida ishga tushirildi`
    );
  });
}

bootstrap()

