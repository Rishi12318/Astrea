# ML Pipeline

This directory contains the training, preprocessing, inference, and evaluation code used by the makeup recommendation system.

## Contents

- `training/` model definitions and training scripts
- `preprocessing/` face detection and feature extraction
- `inference/` prediction and recommendation logic
- `notebooks/` model evaluation notebook
- `datasets/` expected dataset metadata and local manifest files

## Datasets

The code is designed to work with UTKFace, CelebA, beauty product datasets, and custom shade catalogs. Keep large raw datasets outside the repository and point the loaders to local paths.
