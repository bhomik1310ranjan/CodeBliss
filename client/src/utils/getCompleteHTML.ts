const getCompleteHTML = (projectName: string, htmlBody: string) => {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${projectName}</title>
        <link rel="stylesheet" href="./styles.css"/>
    </head>
    <body>
        ${htmlBody}
        <script src="./index.js"></script>
    </body>
</html>
`;
};

export { getCompleteHTML };
