import { type Request, type Response } from "express";
export declare const getAllComments: (req: Request, res: Response) => Promise<void>;
export declare const postComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const likeComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleLike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=comments.controller.d.ts.map