const handleSubmit = (event) => {
    event.preventDefault();

    const name = document.querySelector('input[name=text]').value;
    const email = document.querySelector('input[name=email]').value;

    fetch('https://api.sheetmonkey.io/form/Xc5gL6Z7MnnoD7Nm3wAnK', {

        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    });
}

document.querySelector('form').addEventListener('submit', handleSubmit)