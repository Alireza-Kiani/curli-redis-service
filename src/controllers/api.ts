import { RequestHandler } from 'express';
import validator from 'validator';
import Error from '../utils/error-handler';
import ApiService from './service';
import { RedisLinkData, LinkMonitor } from '../@types/redis';
import hash from '../utils/hash';

const { API_VERSION, LINK_MONITORS, SITE_MONITORS } = process.env;

class ApiController {

    saveMonitorLink: RequestHandler = async (req, res) => {
        try {
            const link: string = req.body.link;
            const data: LinkMonitor = req.body.data;
            let monitorObj: LinkMonitor[] = [data];
            const firstCheck = await ApiService.getValue(LINK_MONITORS!, link);
            console.log(firstCheck);
            if (firstCheck) {
                monitorObj = [
                    ...monitorObj,
                    ...firstCheck
                ]
            }
            await ApiService.setValue(LINK_MONITORS!, link, monitorObj);
            return res.status(200).send({ message: 'New information saved successfully' });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }

    saveMonitorSite: RequestHandler = async (req, res) => {
        try {
            const domain: string = req.body.domain;
            const data: LinkMonitor = req.body.data;
            let monitorObj: LinkMonitor[] = [data];
            const firstCheck = await ApiService.getValue(SITE_MONITORS!, domain);
            console.log(firstCheck);
            if (firstCheck) {
                monitorObj = [
                    ...monitorObj,
                    ...firstCheck
                ]
            }
            await ApiService.setValue(SITE_MONITORS!, domain, monitorObj);
            return res.status(200).send({ message: 'New information saved successfully' });
        } catch (error) {
            console.log(error);
            
            return res.status(400).send(error);
        }
    }

    getMonitorStats: RequestHandler = async (req, res) => {
        try {
            const { field } = req.query;
            let hkey: string = '';
            if (field === 'link') {
                hkey = LINK_MONITORS!
            } else if (field === 'site') {
                hkey = SITE_MONITORS!
            }
            const { input } = req.params;
            const list = await ApiService.getValue(hkey, input);
            return res.status(200).send({ list });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    
    save: RequestHandler = async (req, res) => {
        try {
            const { link } = req.body;
            if (!validator.isURL(link)) {
                throw new Error('Please provide a valid URL');
            }
            // Deprecated Method
            // const randomUniqueLink = CRS({ length: 5 });
            // New Method
            const hashedLinked = hash(link);
            if (!(await ApiService.BloomFilter().exists(hashedLinked))) {
                await ApiService.setValue(API_VERSION!, hashedLinked, {link, date: new Date()});
                await ApiService.BloomFilter().add(hashedLinked);
            }
            return res.status(201).send({ shortLink: hashedLinked });
        } catch (error) {
            return res.status(400).send(error);
        }        
    }

    get: RequestHandler = async (req, res, next) => {
        try {
            const { url } = req.params;
            const redisResponse: RedisLinkData = await ApiService.getValue(API_VERSION!, url);
            if (!redisResponse) {
                throw new Error('Couldn\'t find any URL under the provided link');
            }
            return res.status(200).send({ originalLink: redisResponse.link });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }
}

export default (new ApiController());