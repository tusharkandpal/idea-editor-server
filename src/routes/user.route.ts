import express, { Request, Response } from 'express';
const router = express.Router()
import User from "../models/user.model";

router.route("/")
    .get(async (req: Request, res: Response) => {
        const users = await User.find({});

        res.json({ users });
    })
    .post((req, res) => {

        const { name, price } = req.body;

        const Sweatshirt = new User({ name, price });

        Sweatshirt.save()
            .then(addedProduct => res.json({ addedProduct }))
            .catch(error => console.log(error));
    })

export default router;