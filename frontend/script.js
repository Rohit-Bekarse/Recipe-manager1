document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipeForm');
    const recipeList = document.getElementById('recipeList');

    // Load all recipes when the page loads
    function loadRecipes() {
        fetch('/api/recipes')
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch recipes");
                return response.json();
            })
            .then(data => {
                recipeList.innerHTML = ''; // Clear existing recipes
                data.forEach(recipe => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h3>${recipe.title}</h3>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                        <button class="delete-btn" data-id="${recipe._id}">Delete</button>
                    `;
                    recipeList.appendChild(li);
                });

                // Add event listeners to delete buttons
                const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', deleteRecipe);
                });
            })
            .catch(error => console.error('Error loading recipes:', error));
    }

    // Initial load
    loadRecipes();

    // Handle form submission to add a new recipe
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;

        const newRecipe = { title, ingredients, instructions };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe),
            });

            if (!response.ok) throw new Error("Failed to add recipe");

            loadRecipes(); // Reload recipes
            form.reset();
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('Failed to add recipe. Please check the console for details.');
        }
    });

    // Delete recipe function
    async function deleteRecipe(e) {
        const id = e.target.getAttribute('data-id');

        try {
            const response = await fetch(`/api/recipes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error("Failed to delete recipe");

            loadRecipes(); // Reload recipes
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe. Please check the console for details.');
        }
    }
});
