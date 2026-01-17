import { NextFunction, Request, Response } from "express";
import { Song } from "../models/song.model";
import { Album } from "../models/album.model";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../lib/cloudinary";


export const createSong = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: 'Please upload all files' })
        }

        const { title, artist, albumId, duration } = req.body;

        const audioFile = Array.isArray(req.files.audioFile)
            ? req.files.audioFile[0]
            : req.files.audioFile;

        const imageFile = Array.isArray(req.files.imageFile)
            ? req.files.imageFile[0]
            : req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile)
        const imageUrl = await uploadToCloudinary(imageFile)

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        });

        await song.save();


        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }

        res.status(201).json(song);

    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
        next(error);
    }
}

export const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const song = await Song.findByIdAndDelete(id);

        if (song?.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }

        res.status(200).json({ message: 'Song deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}

export const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ message: 'Please upload image file' })
        }

        const { title, artist, releaseYear } = req.body;

        const imageFile = Array.isArray(req.files.imageFile)
            ? req.files.imageFile[0]
            : req.files.imageFile;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });

        await album.save();

        res.status(201).json(album);

    } catch (error) {
        next(error);
    }
}

export const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId: id });
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: 'Album and associated songs deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}

export const checkAdmin = async (req: Request, res: Response) => {
    res.status(200).json({ admin: true,  message: 'You have admin access' });
}

async function uploadToCloudinary(audioFile: UploadedFile) {
    try {
        const result = await cloudinary.uploader.upload(audioFile.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
