import {readFile,writeFile} from 'node:fs/promises';
const repo='RoyWG925/builder-context';
const response=await fetch(`https://api.github.com/repos/${repo}/commits/main`,{headers:process.env.GH_TOKEN?{Authorization:`Bearer ${process.env.GH_TOKEN}`}:{},signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error(`Identity lookup failed: ${response.status}`);
const sha=(await response.json()).sha;
if(!/^[a-f0-9]{40}$/.test(sha))throw Error('Invalid source commit');
const source=await fetch(`https://raw.githubusercontent.com/${repo}/${sha}/generated/profile-readme.md`,{signal:AbortSignal.timeout(30000)});
if(!source.ok)throw Error(`Identity README failed: ${source.status}`);
const content=await source.text();
if(!content.startsWith('<!-- Generated from RoyWG925/builder-context.')||content.length<100||content.length>50000)throw Error('Invalid generated profile');
let previous='';try{previous=await readFile('README.md','utf8');}catch{}
if(previous!==content)await writeFile('README.md',content);
console.log(`Profile synchronized from ${sha}; changed=${previous!==content}`);
