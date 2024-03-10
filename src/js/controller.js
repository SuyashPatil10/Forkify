// https://forkify-api.herokuapp.com/v2

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept(); 
// }


const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) rendering recipes
    recipeView.render(model.state.recipe);
  }
  catch(err){
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try{
    resultsView.renderSpinner();

    // 1) get Search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search Results
    await model.loadSearchResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial Pagination button
    paginationView.render(model.state.search);
  }
  catch(err){
    console.log(err);
  }
};


const controlPagination = function(goToPage) {
  // 1) render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New Pagination button
  paginationView.render(model.state.search);
}

const controlServings = function(updateTo) {
  // Update the recipe servings (in state)
  model.updateServings(updateTo);

  // update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // 1) Add/Remove bookmarks
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try{
    // show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  }
  catch(err) {
    console.log('🥶', err);
    addRecipeView.renderError(err.message);
  }

}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();