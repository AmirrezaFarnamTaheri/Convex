// static/js/utils.js

/**
 * A collection of utility functions for the Convex Optimization course website.
 */

/**
 * A wrapper for the native fetch API that includes error handling.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options to pass to the fetch call.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 */
export async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

/**
 * A simple DOM query selector.
 * @param {string} selector - The CSS selector to use.
 * @param {Element} [context=document] - The context in which to search.
 * @returns {Element|null} - The first element that matches the selector, or null if no match is found.
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * A simple DOM query selector for all matching elements.
 * @param {string} selector - The CSS selector to use.
 * @param {Element} [context=document] - The context in which to search.
 * @returns {NodeListOf<Element>} - A NodeList of all elements that match the selector.
 */
export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}
