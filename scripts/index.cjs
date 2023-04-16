const gm = require('gm');
const fs = require('fs');

const WIDTH = 850;
const HEIGHT = 700;
const X = 220;
const Y = 500;

const ResolutionW = 1280;
const ResolutionH = 1200;

const atmosphereModelInput = '/Users/guozhiyi/Desktop/atmosphere-model/raw-eps/atmosphere-model-eps';
const atmosphereModelOutput = '/Users/guozhiyi/Desktop/atmosphere-model/raw-pics';

const _28ModelInput = '/Users/guozhiyi/Desktop/28model/raw-eps/28model-eps';
const _28ModelOutput = '/Users/guozhiyi/Desktop/28model/raw-pics';

const seaModelInput = '/Users/guozhiyi/Desktop/sea-model/raw-eps/sea-model-eps';
const seaModelOutput = '/Users/guozhiyi/Desktop/sea-model/raw-pics';

const atmosphereCompareSelectedModelInput = '/Users/guozhiyi/Desktop/atmosphere-compare-model/atmosphere-selected-model/raw-eps/atmosphere-selected-model-eps'
const atmosphereCompareSelectedModelOutput = '/Users/guozhiyi/Desktop/atmosphere-compare-model/atmosphere-selected-model/raw-pics';

const atmosphereCompareSspModelInput = '/Users/guozhiyi/Desktop/atmosphere-compare-model/atmosphere-ssp-model/raw-eps/atmosphere-ssp-eps';
const atmosphereCompareSspModelOutput = '/Users/guozhiyi/Desktop/atmosphere-compare-model/atmosphere-ssp-model/raw-pics';

const seaCompareSelectedModelInput = '/Users/guozhiyi/Desktop/sea-compare-model/sea-selected-model/raw-eps/sea-selected-model-eps';
const seaCompareSelectedModelOutput = '/Users/guozhiyi/Desktop/sea-compare-model/sea-selected-model/raw-pics'

const seaCompareSspModelInput = '/Users/guozhiyi/Desktop/sea-compare-model/sea-ssp-model/raw-eps/sea-ssp-model-eps';
const seaCompareSspModelOutput = '/Users/guozhiyi/Desktop/sea-compare-model/sea-ssp-model/raw-pics';

const seaUnselectedModelInput = '/Users/guozhiyi/Desktop/sea-unselected-model/raw-eps/sea-unselected-model-eps';
const seaUnselectedModelOutput = '/Users/guozhiyi/Desktop/sea-unselected-model/raw-pics';

const highResolutionModelInput = '/Users/guozhiyi/Desktop/high-resolution-model/raw-eps/high-resolution-model-eps';
const highResolutionModelOutput = '/Users/guozhiyi/Desktop/high-resolution-model/raw-pics';

const paths = [
    // {
    //     input: _28ModelInput,
    //     output: _28ModelOutput,
    // },
    // {
    //     input: atmosphereModelInput,
    //     output: atmosphereModelOutput,
    // },
    // {
    //     input: seaModelInput,
    //     output: seaModelOutput,
    // }
    // {
    //     input: atmosphereCompareSelectedModelInput,
    //     output: atmosphereCompareSelectedModelOutput
    // },
    // {
    //     input: atmosphereCompareSspModelInput,
    //     output: atmosphereCompareSspModelOutput
    // },
    // {
    //     input: seaCompareSelectedModelInput,
    //     output: seaCompareSelectedModelOutput,
    // },
    // {
    //     input: seaCompareSspModelInput,
    //     output: seaCompareSspModelOutput
    // },
    // {
    //     input: seaUnselectedModelInput,
    //     output: seaUnselectedModelOutput
    // },
    {
        input: highResolutionModelInput,
        output: highResolutionModelOutput
    }
];

const handleSinglePic = (input, output) => {
    gm(input)
    .resize(ResolutionW, ResolutionH, '^')
    .density(ResolutionW, ResolutionH)
    .gravity('Center')
    .write(output, (err) => {
        if (err) {
            throw new Error(err);
        }
        gm(output)
            .crop(WIDTH, HEIGHT, X, Y)
            .write(output, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });
    });
}

handleSinglePic(
    '/Users/guozhiyi/Desktop/ACCESS-ESM1-5_coupling.eps',
    '/Users/guozhiyi/Desktop/ACCESS-ESM1-5_coupling.png'
)

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @param {(value: any) => void} fatherRes
 */
const handlePics = (input, output, fatherRes) => {
    fs.readdir(input, (err, fileNames) => {
        if (err) {
            throw new Error(err);
        }
        fileNames = fileNames.filter((name) => {
            return name.endsWith('.eps');
        })
        console.log('---------------------------------------------');
        console.log(`I\'m going to handle the .eps file list below`);
        console.log(fileNames);
        console.log(`The input path is ${input}`);
        console.log(`The output path is ${output}`);
        console.log('I\'m running the code...');
        let p = Promise.resolve();
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i].replace('.eps', '');
            p = p.then(() => {
                return new Promise((res) => {
                    gm(`${input}/${fileName}.eps`)
                        .resize(ResolutionW, ResolutionH, '^')
                        .density(ResolutionW, ResolutionH)
                        .gravity('Center')
                        .write(`${output}/${fileName}.png`, (err) => {
                            if (err) {
                                throw new Error(err);
                            }
                            console.log(` ${fileName}.eps has been generated! `);
                            gm(`${output}/${fileName}.png`)
                                .crop(WIDTH, HEIGHT, X, Y)
                                .write(`${output}/${fileName}.png`, (err) => {
                                    if (err) {
                                        throw new Error(err);
                                    }
                                    console.log(` ${fileName}.png has been croped! `);
                                    res();
                                    if (i === fileNames.length - 1) {
                                        fatherRes();
                                        console.log(`Congragulation! All .eps files from ${input} have been translated into .png files!`)
                                        console.log('---------------------------------------------');
                                    }
                                });
                        });
                })
            })
        }
    });
}

const main = () => {
    let _p = Promise.resolve();
    for (const {input, output} of paths) {
        _p = _p.then(() => {
            return new Promise((res) => {
                handlePics(input, output, res);
            })
        })
    }
}

// main();
