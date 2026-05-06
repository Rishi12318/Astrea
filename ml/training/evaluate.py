from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


def evaluate(predictions: list[int], targets: list[int], label_names: list[str]) -> dict:
    acc = accuracy_score(targets, predictions)
    report = classification_report(targets, predictions, target_names=label_names, output_dict=True)
    matrix = confusion_matrix(targets, predictions)
    results = {"accuracy": acc, "report": report, "confusion_matrix": matrix.tolist()}
    output_dir = Path("artifacts")
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "evaluation.json").write_text(json.dumps(results, indent=2), encoding="utf-8")

    plt.figure(figsize=(8, 6))
    plt.imshow(matrix, cmap="Blues")
    plt.title("Confusion Matrix")
    plt.colorbar()
    plt.tight_layout()
    plt.savefig(output_dir / "confusion_matrix.png", dpi=200)
    plt.close()
    return results
